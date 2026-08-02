import { AuthShowcaseArt } from "@/components/shared/illustrations/auth-art";
import { Logo } from "@/components/shared/logo";

export function AuthSplitLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <div className="flex flex-1 flex-col px-6 py-8 md:px-12 lg:px-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <header>
            <Logo />
          </header>

          <main
            id="main-content"
            className="flex flex-1 flex-col justify-center py-12"
          >
            <h1 className="text-h4 font-bold text-foreground md:text-h3">
              {title}
            </h1>
            <p className="mt-3 text-body-sm text-muted-foreground">
              {description}
            </p>

            <div className="mt-10">{children}</div>
          </main>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[46%] lg:shrink-0 lg:items-center lg:justify-center lg:p-8">
        <AuthShowcaseArt className="max-w-lg" />
      </div>
    </div>
  );
}
