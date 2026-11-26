import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
  image: string;
  imageAlt: string;
}

export default function AuthLayout({
  children,
  image,
  imageAlt,
}: AuthLayoutProps) {
  return (
    <main className={styles.container}>
      <section className={styles.formSection}>
        <div className={styles.logo}>
          <Image
            src="/lehlehkaLogo.svg"
            alt="Lehlehka"
            width={120}
            height={40}
            priority
          />
        </div>

        <div className={styles.formWrapper}>{children}</div>
      </section>

      <section className={styles.imageSection}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
          className={styles.illustration}
        />
      </section>
    </main>
  );
}
