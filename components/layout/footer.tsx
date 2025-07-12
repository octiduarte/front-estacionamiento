import { useTranslations } from "next-intl";
import { getCurrentItalyTime } from "@/lib/italy-time";

export function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gradient-to-b from-muted to-black  py-6 md:py-0">
      <div className="container flex justify-center items-center gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-center">
          &copy; {getCurrentItalyTime().getFullYear()} ParkEasy. {t("rights")}.
        </p>
      </div>
    </footer>
  );
}
