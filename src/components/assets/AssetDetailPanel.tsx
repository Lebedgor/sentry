import { Link } from "react-router-dom";
import { Drawer } from "@/components/ui/Overlay";
import { RiskBadge, SeverityBadge } from "@/components/app/Badges";
import { AssetStatusIndicator } from "@/components/ui/StatusDot";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatDate, relativeTime } from "@/lib/utils";
import { assetTypeLabels, severityMeta } from "@/lib/status";
import type { Asset } from "@/types";

export function AssetDetailPanel({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  const { toast, incidents, scanAsset, toggleAssetPause } = useStore();
  if (!asset) return null;

  const relatedIncidents = incidents.filter((i) => i.assetId === asset.id);
  const isPaused = asset.status === "paused";

  return (
    <Drawer open onClose={onClose} title={asset.name} wide>
      <div className="space-y-6 px-5 py-5">
        {/* Overview */}
        <div className="flex flex-wrap items-center gap-2">
          <AssetStatusIndicator status={asset.status} label />
          <RiskBadge risk={asset.risk} />
          <span className="text-xs text-zinc-400">{assetTypeLabels[asset.type]}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Findings</p>
            <p className="tabular mt-1 text-xl font-semibold text-zinc-950">{asset.findings}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Critical</p>
            <p className={`tabular mt-1 text-xl font-semibold ${asset.criticalFindings > 0 ? "text-red-600" : "text-zinc-950"}`}>
              {asset.criticalFindings}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Last scan</p>
            <p className="mt-1 text-[13px] font-medium text-zinc-950">{relativeTime(asset.lastScanned)}</p>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <h4 className="text-[13px] font-semibold text-zinc-950">Metadata</h4>
          <dl className="mt-2 grid gap-x-6 gap-y-2.5 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2">
            {Object.entries(asset.meta).map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{key}</dt>
                <dd className="mt-0.5 truncate font-mono text-[13px] text-zinc-950">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Findings */}
        <div>
          <h4 className="text-[13px] font-semibold text-zinc-950">
            Findings {asset.findingDetails.length > 0 && `(${asset.findingDetails.length})`}
          </h4>
          {asset.findingDetails.length === 0 ? (
            <p className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-[13px] text-zinc-500">
              No open findings. Last scan was clean.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {asset.findingDetails.map((f) => (
                <li key={f.id} className="rounded-lg border border-zinc-200 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={f.severity} />
                    <span className="text-[13.5px] font-medium text-zinc-950">{f.title}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">{f.detail}</p>
                  <p className="mt-1.5 text-[11px] text-zinc-400">
                    First seen {formatDate(f.firstSeen)} · {relativeTime(f.firstSeen)} · priority {severityMeta[f.severity].label}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Related incidents */}
        {relatedIncidents.length > 0 && (
          <div>
            <h4 className="text-[13px] font-semibold text-zinc-950">Related incidents</h4>
            <ul className="mt-2 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
              {relatedIncidents.map((inc) => (
                <li key={inc.id}>
                  <Link
                    to={`/incidents/${inc.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-zinc-950">{inc.title}</span>
                      <span className="block font-mono text-[11px] text-zinc-400">{inc.id}</span>
                    </span>
                    <SeverityBadge severity={inc.severity} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-5">
          <Button
            size="sm"
            onClick={() => {
              scanAsset(asset.id);
              toast(`Scan queued for ${asset.name}`);
            }}
          >
            Run scan now
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              toggleAssetPause(asset.id);
              toast(isPaused ? `Monitoring resumed for ${asset.name}` : `Monitoring paused for ${asset.name}`);
            }}
          >
            {isPaused ? "Resume monitoring" : "Pause monitoring"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
