import Image from "next/image";
import { motion } from "framer-motion"

function LoadingState() {
  return (
    <div className=" flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0.3, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0.3, scale: 0.5, y: 50 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image src="/logo.jpg" alt="logo" width={50} height={50} />
      </motion.div>
    </div>
  );
}

export default LoadingState