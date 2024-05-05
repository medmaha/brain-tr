import Image from "next/image";
import Hashtags from "./Hashtags";

export function VideoDetails({ thumbnail }: any) {
  return (
    <div className="sm:flex flex-wrap items-start gap-4 md:max-w-[450px] lg:max-w-[500px]">
      <div className="flex-1 space-y-4">
        <div className="grid">
          <label htmlFor="media_name" className="text-sm mb-2">
            Caption
          </label>
          <textarea
            name="caption"
            id="media_name"
            required
            placeholder="Add a title that describes your video"
            className="input min-w-[200px] !min-h-[100px] md:min-h-[50px] text-sm p-1.5"
          ></textarea>
        </div>
        <Hashtags />
      </div>
      <div className="grid m-0" key={thumbnail?.id}>
        <label htmlFor="" className="text-sm mb-2">
          Thumbnail
        </label>
        {thumbnail && (
          <div className="rounded w-full md:w-[250px] lg:w-max border-2 border-gray-500/20 overflow-hidden">
            <Image
              key={String(thumbnail)}
              alt="active thumbnail"
              src={URL.createObjectURL(thumbnail)}
              width={500}
              placeholder="blur"
              blurDataURL={URL.createObjectURL(thumbnail)}
              height={280}
            />
          </div>
        )}
      </div>
    </div>
  );
}
