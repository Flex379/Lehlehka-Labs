"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { createTask, getMe, getTasks, updateTaskStatus } from "@/lib/api/clientApi";
import type { TasksResponse } from "@/types/task";
import type { TaskFormValues } from "@/components/AddTaskForm/AddTaskForm";
import AddTaskModal from "@/components/AddTaskModal/AddTaskModal";
import TaskList, { type TaskListItem } from "@/components/TaskList/TaskList";
import TaskLoader from "./TaskLoader";
import styles from "./TasksReminderCard.module.css";

interface TasksReminderCardProps {
  isAuthenticated?: boolean;
  userId?: string;
}

const TASKS_QUERY_KEY = ["tasks", "list"] as const;
const TASKS_PARAMS = { limit: 10, sortOrder: "asc" } as const;

// Reuse the existing user API when the parent page has not supplied auth state.
async function checkCurrentUser(): Promise<{ id?: string } | null> {
  try {
    const user: unknown = await getMe();
    if (user && typeof user === "object") {
      if ("_id" in user && typeof user._id === "string") return { id: user._id };
      if ("id" in user && typeof user.id === "string") return { id: user.id };
    }
    return {};
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
}

export default function TasksReminderCard({ isAuthenticated, userId }: TasksReminderCardProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const instanceId = useId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const needsAuthCheck = isAuthenticated === undefined || (isAuthenticated && !userId);
  const authQuery = useQuery({
    queryKey: ["tasks", "current-user"],
    queryFn: checkCurrentUser,
    enabled: needsAuthCheck,
    retry: false,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const authLoading = needsAuthCheck && authQuery.isPending;
  const authError = needsAuthCheck && authQuery.isError;
  const authenticated = !authLoading && !authError && (
    needsAuthCheck ? Boolean(authQuery.data) : Boolean(isAuthenticated)
  );
  const accountKey = userId ?? authQuery.data?.id ?? instanceId;

  const tasksQuery = useInfiniteQuery({
    queryKey: [...TASKS_QUERY_KEY, accountKey],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<TasksResponse> =>
      getTasks({ ...TASKS_PARAMS, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: authenticated,
    retry: false,
  });

  const { fetchNextPage, hasNextPage, isFetching, isFetchNextPageError } = tasksQuery;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !authenticated || !hasNextPage || isFetching || isFetchNextPageError) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void fetchNextPage({ cancelRefetch: false });
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [authenticated, hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  const authErrorAt = authQuery.errorUpdatedAt;
  const tasksErrorAt = tasksQuery.errorUpdatedAt;
  useEffect(() => {
    if (authError && authErrorAt) {
      toast.error("Не вдалося перевірити авторизацію.", { id: `tasks-auth-${authErrorAt}` });
    }
  }, [authError, authErrorAt]);
  useEffect(() => {
    if (authenticated && tasksQuery.isError && tasksErrorAt) {
      toast.error(
        isFetchNextPageError ? "Не вдалося завантажити наступні завдання." : "Не вдалося завантажити завдання.",
        { id: `tasks-load-${tasksErrorAt}` },
      );
    }
  }, [authenticated, tasksQuery.isError, tasksErrorAt, isFetchNextPageError]);

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: () => { toast.error("Не вдалося створити завдання."); },
  });

  const statusMutation = useMutation({
    mutationFn: (task: TaskListItem) => updateTaskStatus(task.id, { isDone: !task.isDone }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
    onError: () => { toast.error("Не вдалося змінити статус завдання."); },
  });

  function handleAdd() {
    if (authLoading || authError || createMutation.isPending) return;
    if (!authenticated) {
      router.push("/auth/register");
      return;
    }
    createMutation.reset();
    setIsModalOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    const [day, month, year] = values.date.split(".");
    try {
      await createMutation.mutateAsync({ name: values.name, date: `${year}-${month}-${day}` });
      setIsModalOpen(false);
    } catch {
      // onError shows the toast; the form stays open for retry.
    }
  }

  const tasks = authenticated ? (tasksQuery.data?.pages.flatMap((page) => page.tasks) ?? []) : [];
  const items = tasks.map(({ _id, ...task }) => ({ id: _id, ...task }));
  const isLoading = authLoading || (authenticated && tasksQuery.isPending);
  const hasError = authError || (authenticated && tasksQuery.isError && !tasksQuery.data);
  const isEmpty = !isLoading && !hasError && items.length === 0;
  const isBusy = isLoading || (needsAuthCheck && authQuery.isFetching) || (authenticated && (tasksQuery.isFetching || statusMutation.isPending || createMutation.isPending));

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Важливі завдання</h2>
        <button type="button" className={styles.addButton} onClick={handleAdd} disabled={authLoading || authError || createMutation.isPending} aria-label="Створити завдання">
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons-sprite.svg#icon-add-circle" />
          </svg>
        </button>
      </div>
      <div className={styles.content} aria-busy={isBusy}>
        {isLoading && <div className={styles.loading}><TaskLoader /></div>}
        {hasError && <p role="alert" className={styles.error}>{authError ? "Не вдалося перевірити авторизацію." : "Не вдалося завантажити завдання."}</p>}
        {isEmpty && (
          <div className={styles.empty}>
            <div className={styles.emptyText}>
              <p className={styles.emptyTitle}>Наразі немає жодних завдань</p>
              <p>Створіть мершій нове завдання!</p>
            </div>
            <button type="button" className={styles.createButton} onClick={handleAdd} disabled={createMutation.isPending}>
              Створити завдання
            </button>
          </div>
        )}
        {items.length > 0 && (
          <TaskList
            tasks={items}
            onToggle={(task) => {
              if (!statusMutation.isPending) statusMutation.mutate(task);
            }}
            pendingTaskId={statusMutation.isPending ? statusMutation.variables?.id : undefined}
          />
        )}
        {authenticated && hasNextPage && <div ref={loadMoreRef} className={styles.loadMore} aria-hidden="true" />}
        {authenticated && isFetchNextPageError && <p role="alert" className={styles.error}>Не вдалося завантажити наступні завдання.</p>}
        {!isLoading && isBusy && <div className={styles.loading}><TaskLoader /></div>}
      </div>
      {isModalOpen && authenticated && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          submitError={createMutation.isError ? "Не вдалося створити завдання." : undefined}
        />
      )}
    </section>
  );
}
