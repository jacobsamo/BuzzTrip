import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

const DevelopmentCTA = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want to Influence Our Roadmap?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community and help shape the future of BuzzTrip. Your
            feedback drives our development priorities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://git.new/buzztrip"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
            >
              Join the development
            </Link>
            {/* <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Send Feedback
              </Button> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevelopmentCTA;
