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

type FileType = "image" | "video" | "audio" | "other";
