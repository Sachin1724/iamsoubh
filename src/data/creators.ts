export interface Creator {
  /** Instagram post shortcode from the brief. */
  postId: string;
  name: string;
  handle: string;
  /** Under 10 words. Written after watching the video. */
  pullLine: string;
  /** Self-hosted MP4 once written permission is in. Null means poster-only. */
  video: string | null;
  poster: string;
  /** Paid or gifted collaborations must be labelled (ASCI). */
  collab: boolean;
}

// Order is load-bearing: creator-0N.mp4 is encoded from VIDEOPROFILE/N.mp4, and
// slot N is the Nth reel in the list Soubh supplied. Re-encoding from differently
// named sources will silently reorder these, so keep the numbering.
//
// Names, pull lines and collab flags are still to be confirmed with Soubh.
export const creators: Creator[] = [
  {
    postId: "DTNeI7gAXQd",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-01.mp4",
    poster: "/assets/videos/poster-01.webp",
    collab: false,
  },
  {
    postId: "DR2HiElDCWN",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-02.mp4",
    poster: "/assets/videos/poster-02.webp",
    collab: false,
  },
  {
    postId: "DS6dshSkVVu",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-03.mp4",
    poster: "/assets/videos/poster-03.webp",
    collab: false,
  },
  {
    postId: "DTacYmMibCJ",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-04.mp4",
    poster: "/assets/videos/poster-04.webp",
    collab: false,
  },
  {
    postId: "DSl3SA9E6Fq",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-05.mp4",
    poster: "/assets/videos/poster-05.webp",
    collab: false,
  },
  {
    postId: "DRpWX2wiXBC",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-06.mp4",
    poster: "/assets/videos/poster-06.webp",
    collab: false,
  },
  {
    postId: "DRJMENEEr4S",
    name: "",
    handle: "",
    pullLine: "",
    video: "/assets/videos/creator-07.mp4",
    poster: "/assets/videos/poster-07.webp",
    collab: false,
  },
];
