import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const GeneralCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full"
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Mapping?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the future of custom mapping. Start creating beautiful,
            interactive maps today and be part of our growing community.
          </p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/sign-up"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg",
                })}
              >
                Start Creating Maps
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            {/* <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-text-gray-100 hover:bg-primary hover:text-white px-8 py-4 text-lg"
                >
                  View Demo
                </Button>
              </motion.div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-8 text-white/70 text-sm"
          >
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Join early adopters
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GeneralCTA;
