"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  FileText,
  Key,
  Copy,
  Check,
  X,
  ExternalLink,
  Eye,
} from "lucide-react";

type TokenType = "access" | "refresh" | "id";

const TOKEN_META: Record<TokenType, { label: string }> = {
  access: { label: "Access Token" },
  refresh: { label: "Refresh Token" },
  id: { label: "ID Token" },
};

function TokenModal({
  type,
  token,
  onClose,
}: {
  type: TokenType;
  token?: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const meta = TOKEN_META[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.97) translateY(8px)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Key size={16} color="#6b7280" />
              <div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {meta.label}
                </h3>
                <p
                  style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}
                >
                  {token ? `${token.length} characters` : "Not available"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "transparent",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <X size={14} color="#6b7280" />
            </button>
          </div>

          {/* Token content */}
          <div style={{ padding: "16px 20px" }}>
            <div
              className="token-scroll"
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                padding: "14px",
                maxHeight: "260px",
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: "12px",
                  lineHeight: "1.7",
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {token || "Token not available"}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 20px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                color: "#374151",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              disabled={!token}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: token ? "pointer" : "not-allowed",
                border: "1px solid #e5e7eb",
                backgroundColor: copied ? "#f0fdf4" : "#111827",
                color: copied ? "#16a34a" : "#fff",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (token && !copied)
                  e.currentTarget.style.backgroundColor = "#1f2937";
              }}
              onMouseLeave={(e) => {
                if (!copied)
                  e.currentTarget.style.backgroundColor = "#111827";
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { data: session, status } = useSession();
  const [activeToken, setActiveToken] = useState<TokenType | null>(null);

  if (status !== "authenticated" || !session) return null;

  const user = session.user;
  const firstName = session.firstName || "";
  const lastName = session.lastName || "";
  const username = session.username || "";

  const infoItems = [
    { label: "Username", value: username, icon: <User size={14} /> },
    { label: "Email", value: user?.email, icon: <Mail size={14} /> },
    { label: "First Name", value: firstName, icon: <FileText size={14} /> },
    { label: "Last Name", value: lastName, icon: <FileText size={14} /> },
  ];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const displayName = user?.name || username || "User";

  const tokenMap: Record<TokenType, string | undefined> = {
    access: session.accessToken,
    refresh: session.refreshToken,
    id: session.idToken,
  };

  return (
    <>
      <section className="flex flex-col gap-5">
        {/* Profile Card */}
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            {user?.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                {firstName?.[0]}
                {lastName?.[0]}
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0 text-sm"
              >
                <span className="text-gray-400 shrink-0">{item.icon}</span>
                <span className="text-gray-400 w-24 shrink-0 text-xs">
                  {item.label}
                </span>
                <span className="font-medium">{item.value || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Token Cards */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Key size={16} className="text-gray-500" />
            Tokens
          </h3>

          <div className="flex flex-col gap-2">
            {(
              Object.entries(TOKEN_META) as [
                TokenType,
                (typeof TOKEN_META)["access"],
              ][]
            ).map(([type, meta]) => (
              <button
                key={type}
                onClick={() => setActiveToken(type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Key size={14} color="#9ca3af" />
                  <div>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      {meta.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        margin: "1px 0 0",
                        fontFamily: "monospace",
                      }}
                    >
                      {tokenMap[type]
                        ? `${tokenMap[type]!.slice(0, 36)}...`
                        : "Not available"}
                    </p>
                  </div>
                </div>
                <Eye size={14} color="#9ca3af" />
              </button>
            ))}
          </div>
        </div>

        {/* Redirect Buttons */}
        <div className="flex gap-3">
          <a
            href={appUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#111827",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              flex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1f2937";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#111827";
            }}
          >
            <ExternalLink size={14} />
            Go to App
          </a>
        </div>
      </section>

      {/* Token Modal */}
      {activeToken && (
        <TokenModal
          type={activeToken}
          token={tokenMap[activeToken]}
          onClose={() => setActiveToken(null)}
        />
      )}
    </>
  );
}
