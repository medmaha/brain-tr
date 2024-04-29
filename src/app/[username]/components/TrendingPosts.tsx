import Image from "next/image";
import React from "react";

export default function TrendingPosts() {
  return (
    <div className="col-span-2 space-y-6">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
        <Image
          src="/test1.png"
          alt="Post Thumbnail"
          width={800}
          height={400}
          className="rounded-t-lg w-full h-48 object-cover"
          style={{
            aspectRatio: "800",
            objectFit: "cover",
          }}
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">
            Exploring the Wonders of Nature
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join us as we embark on a journey through the stunning landscapes of
            our planet, discovering the beauty and diversity of the natural
            world.
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow">
        <Image
          src="/test2.png"
          alt="Post Thumbnail"
          width={800}
          height={400}
          className="rounded-t-lg w-full h-48 object-cover"
          style={{
            aspectRatio: "800",
            objectFit: "cover",
          }}
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">The Art of Mindfulness</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Learn how to cultivate a deeper sense of presence and inner peace
            through the practice of mindfulness. Discover techniques to reduce
            stress and find more joy in everyday life.
          </p>
        </div>
      </div>
    </div>
  );
}
