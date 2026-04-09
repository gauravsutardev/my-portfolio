import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../CSS/Gallery.css";

const publicPath = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const IMAGES = {
  personal: [
    {
      id: 1,
      caption: "For a minute there, I lost myself.",
      photos: [
        publicPath("gallery/R1.jpg"),
        publicPath("gallery/R2.jpg"),
      ],
    },
    {
      id: 2,
      caption: "Lost in the beauty of Kokan.",
      photos: [
        publicPath("gallery/k1.jpg"),
        publicPath("gallery/kokan-2.jpg"),
        publicPath("gallery/kokan-3.jpg"),
      ],
    },
    {
      id: 3,
      caption: "Lost in nature, found in the mountains.",
      photos: [publicPath("gallery/b1.jpg"), publicPath("gallery/nature-2.jpg")],
    },
  ],
  achievements: [
    {
      id: 1,
      caption: "",
      photos: [""],
    },
    {
      id: 2,
      caption: "",
      photos: [""],
    },
  ],
};

const pageVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export default function Gallery() {
  const [tab, setTab] = useState("personal");
  const [zoom, setZoom] = useState({ img: null, post: null, index: 0 });

  const openZoom = (post, index) =>
    setZoom({ img: post.photos[index], post, index });

  const closeZoom = () => setZoom({ img: null, post: null, index: 0 });

  const nextImage = () => {
    if (!zoom.post) return;
    const nextIndex = (zoom.index + 1) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[nextIndex], index: nextIndex });
  };

  const prevImage = () => {
    if (!zoom.post) return;
    const prevIndex =
      (zoom.index - 1 + zoom.post.photos.length) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[prevIndex], index: prevIndex });
  };

  return (
    <motion.section
      className="gallery-container"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.h2 className="gallery-title" variants={childVariants}>
        Gallery
      </motion.h2>

      <motion.div className="tab-buttons" variants={childVariants}>
        {["personal", "achievements"].map((type) => (
          <motion.button
            key={type}
            className={`tab ${tab === type ? "active" : ""}`}
            onClick={() => setTab(type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="post-feed"
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {IMAGES[tab].map((post) => (
            <motion.div
              key={post.id}
              className="post-card"
              variants={childVariants}
              whileHover={{ y: -2 }}
            >
              <p className="caption">{post.caption}</p>
              <div
                className={`photo-grid ${
                  post.photos.length > 1 ? "multi" : "single"
                }`}
              >
                {post.photos.map((src, i) => (
                  <motion.div
                    key={i}
                    className="photo-item"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    onClick={() => openZoom(post, i)}
                  >
                    <img
                      src={src}
                      alt="gallery"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {zoom.img && (
          <motion.div
            className="zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              key={zoom.img}
              src={zoom.img}
              alt="zoom"
              className="zoom-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {zoom.post?.photos.length > 1 && (
              <>
                <button className="nav-btn left" onClick={prevImage}>
                  <ChevronLeft size={32} />
                </button>
                <button className="nav-btn right" onClick={nextImage}>
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <button className="close-btn" onClick={closeZoom}>
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
