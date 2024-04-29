//
type ID = string;

interface PageProps {
  params: {
    [key: string]: string;
  };
  searchParams: {
    [key: string]: string;
  };
}

type FileType = "image" | "video" | "audio" | "comment" | "avatar" | "other";

type ActionReturn<T = any> = { message: string } & (
  | { success: true; data: T }
  | { success: false }
);

type FormActionReturn<T = any> = ActionReturn<T>;
