import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';

interface ExitDisclaimerProps {
  url: string | null;
  onClose: () => void;
}

export function ExitDisclaimer({ url, onClose }: ExitDisclaimerProps) {
  const handleContinue = () => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Dialog open={!!url} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md bg-[hsl(var(--background))] border border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              You're leaving IPO Insider
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm text-white/70">
          <p>
            You are about to visit an external website. Please read the following before continuing:
          </p>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-3">
            <p className="font-semibold text-amber-300 text-xs uppercase tracking-wider">
              Legal Notice
            </p>
            <p>
              <strong className="text-white">You are solely responsible</strong> for any trading,
              investing, or financial decisions you make after leaving this site. IPO Insider is an
              educational simulation platform only. Nothing on this site constitutes financial advice,
              investment advice, or a recommendation to buy or sell any security.
            </p>
            <p>
              IPO Insider is{' '}
              <strong className="text-white">not affiliated with, endorsed by, or connected to</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60 text-xs ml-1">
              <li>ThinkBox AI Operating Systems</li>
              <li>MJUnlimited Essential Mktg</li>
            </ul>
            <p className="text-xs text-white/50">
              These entities are named solely to clarify that this platform operates entirely
              independently of them. Any resemblance to their services is coincidental.
            </p>
          </div>

          <p className="text-xs text-white/40">
            External sites have their own terms, privacy policies, and risks. You are leaving IPO
            Insider's educational environment.
          </p>
        </div>

        <DialogFooter className="flex gap-3 mt-2 sm:flex-row flex-col-reverse">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            I Understand — Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
