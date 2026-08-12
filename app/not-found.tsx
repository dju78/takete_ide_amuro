import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-ivory">
      <Container className="max-w-lg text-center">
        <Compass className="mx-auto h-12 w-12 text-purple-600/40" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-purple-600">Page Not Found</h1>
        <p className="mt-3 text-charcoal/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist, may have moved, or is still being prepared.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonLink href="/">Return Home</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact Us</ButtonLink>
        </div>
      </Container>
    </div>
  );
}
