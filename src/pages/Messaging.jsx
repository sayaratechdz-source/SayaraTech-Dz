// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Stack, TextField, IconButton, Avatar,
  Badge, InputAdornment, Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";

// Storage helpers
export function getMessages() {
  try { return JSON.parse(localStorage.getItem("sayara_messages") || "[]"); }
  catch { return []; }
}
export function sendMessage(from, to, fromName, toName, text) {
  const msgs = getMessages();
  const msg = { id: Date.now(), from, to, fromName, toName, text, date: new Date().toISOString(), read: false };
  localStorage.setItem("sayara_messages", JSON.stringify([...msgs, msg]));
  return msg;
}
export function getConversation(userA, userB) {
  return getMessages()
    .filter(m => (m.from === userA && m.to === userB) || (m.from === userB && m.to === userA))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
export function markRead(currentUser) {
  const msgs = getMessages().map(m => m.to === currentUser ? { ...m, read: true } : m);
  localStorage.setItem("sayara_messages", JSON.stringify(msgs));
}
export function getUnreadCount(currentUser) {
  return getMessages().filter(m => m.to === currentUser && !m.read).length;
}
export function getContacts(currentUser) {
  const msgs = getMessages().filter(m => m.from === currentUser || m.to === currentUser);
  const map = {};
  msgs.forEach(m => {
    const other = m.from === currentUser ? m.to : m.from;
    const otherName = m.from === currentUser ? m.toName : m.fromName;
    if (!map[other]) map[other] = { id: other, name: otherName, lastMsg: m, unread: 0 };
    else if (new Date(m.date) > new Date(map[other].lastMsg.date)) map[other].lastMsg = m;
    if (m.to === currentUser && !m.read) map[other].unread++;
  });
  return Object.values(map).sort((a, b) => new Date(b.lastMsg.date) - new Date(a.lastMsg.date));
}

const PALETTE = ["#E63946", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];
function colorFor(name) { return PALETTE[(name?.charCodeAt(0) || 0) % PALETTE.length]; }
function fmtTime(iso) {
  return iso ? new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "";
}
function fmtDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
}

export default function MessagingPanel({ currentUser, currentUserName, defaultContact = null, height = 560 }) {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(defaultContact);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const bottomRef = useRef(null);

  const refresh = () => {
    setContacts(getContacts(currentUser));
    if (selected) {
      setMessages(getConversation(currentUser, selected.id));
      markRead(currentUser);
    }
  };

  useEffect(() => { refresh(); }, [currentUser, selected?.id]);
  useEffect(() => {
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, [currentUser, selected?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !selected) return;
    sendMessage(currentUser, selected.id, currentUserName, selected.name, text.trim());
    setText("");
    refresh();
  };

  const selectContact = (c) => { setSelected(c); setMobileView("chat"); };
  const filtered = contacts.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
  const myColor = colorFor(currentUserName);
  const totalUnread = contacts.reduce((s, c) => s + (c.unread || 0), 0);

  return (
    <Box sx={{
      display: "flex",
      height,
      borderRadius: 3,
      border: "1px solid #e8e8e8",
      overflow: "hidden",
      bgcolor: "#fff",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>

      {/* Sidebar contacts */}
      <Box sx={{
        width: { xs: mobileView === "list" ? "100%" : 0, sm: 260 },
        flexShrink: 0,
        borderRight: "1px solid #f0f0f0",
        display: { xs: mobileView === "list" ? "flex" : "none", sm: "flex" },
        flexDirection: "column",
        bgcolor: "#fafafa",
      }}>
        <Box sx={{ p: 2.5, borderBottom: "1px solid #f0f0f0" }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#E63946", boxShadow: "0 0 6px rgba(230,57,70,0.5)" }} />
            <Typography sx={{ color: "#1a1a1a", fontWeight: 800, fontSize: 14, flex: 1 }}>
              Messages
            </Typography>
            {totalUnread > 0 && (
              <Chip label={totalUnread} size="small"
                sx={{ bgcolor: "#E63946", color: "#fff", fontWeight: 800, fontSize: 10, height: 18, minWidth: 18 }} />
            )}
          </Stack>
          <TextField
            size="small" fullWidth placeholder="Rechercher..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 15, color: "#ccc" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#1a1a1a", borderRadius: "10px", fontSize: 12,
                bgcolor: "#fff",
                "& fieldset": { borderColor: "#e8e8e8" },
                "&:hover fieldset": { borderColor: "#E63946" },
                "&.Mui-focused fieldset": { borderColor: "#E63946" },
              },
              "& input::placeholder": { color: "#ccc", fontSize: 12 },
            }}
          />
        </Box>

        <Box sx={{
          flex: 1, overflowY: "auto",
          "&::-webkit-scrollbar": { width: 3 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: 2 },
        }}>
          {filtered.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: "#e0e0e0", mb: 1 }} />
              <Typography sx={{ color: "#ccc", fontSize: 12 }}>
                {search ? "Aucun resultat" : "Aucune conversation"}
              </Typography>
            </Box>
          )}
          {filtered.map(c => {
            const active = selected?.id === c.id;
            const col = colorFor(c.name);
            return (
              <Box key={c.id} onClick={() => selectContact(c)} sx={{
                px: 2, py: 1.5, cursor: "pointer", transition: "all 0.15s",
                bgcolor: active ? "rgba(230,57,70,0.05)" : "transparent",
                borderLeft: active ? "3px solid #E63946" : "3px solid transparent",
                "&:hover": { bgcolor: active ? "rgba(230,57,70,0.07)" : "rgba(0,0,0,0.02)" },
              }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Badge badgeContent={c.unread || 0} color="error"
                    sx={{ "& .MuiBadge-badge": { fontSize: 9, minWidth: 15, height: 15 } }}>
                    <Avatar sx={{
                      width: 38, height: 38,
                      bgcolor: col + "15",
                      border: "2px solid " + col + "30",
                      fontSize: 14, fontWeight: 800, color: col,
                    }}>
                      {(c.name || "?")[0].toUpperCase()}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{
                      color: active ? "#1a1a1a" : "#444",
                      fontSize: 13, fontWeight: 700,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {c.name}
                    </Typography>
                    <Typography sx={{
                      color: "#bbb", fontSize: 11,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", mt: 0.2,
                    }}>
                      {(c.lastMsg?.text || "").slice(0, 28)}{(c.lastMsg?.text?.length || 0) > 28 ? "..." : ""}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#ccc", fontSize: 10, flexShrink: 0 }}>
                    {fmtTime(c.lastMsg?.date)}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Zone conversation */}
      <Box sx={{
        flex: 1,
        display: { xs: mobileView === "chat" ? "flex" : "none", sm: "flex" },
        flexDirection: "column",
        minWidth: 0,
        bgcolor: "#fff",
      }}>
        {!selected ? (
          <Box sx={{
            flex: 1, display: "flex", alignItems: "center",
            justifyContent: "center", flexDirection: "column", gap: 2,
          }}>
            <Box sx={{
              width: 68, height: 68, borderRadius: "50%",
              bgcolor: "rgba(230,57,70,0.05)",
              border: "1px solid rgba(230,57,70,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: "rgba(230,57,70,0.3)" }} />
            </Box>
            <Typography sx={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>
              Selectionnez une conversation
            </Typography>
          </Box>
        ) : (
          <>
            {/* Header conversation */}
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f0f0f0", bgcolor: "#fafafa" }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <IconButton size="small" onClick={() => setMobileView("list")}
                  sx={{ display: { sm: "none" }, color: "#bbb", mr: 0.5 }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Avatar sx={{
                  width: 36, height: 36,
                  bgcolor: colorFor(selected.name) + "15",
                  border: "2px solid " + colorFor(selected.name) + "30",
                  fontSize: 13, fontWeight: 800, color: colorFor(selected.name),
                }}>
                  {(selected.name || "?")[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ color: "#1a1a1a", fontWeight: 700, fontSize: 14 }}>
                    {selected.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10b981" }} />
                    <Typography sx={{ color: "#bbb", fontSize: 11 }}>En ligne</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Messages */}
            <Box sx={{
              flex: 1, overflowY: "auto", p: 2.5,
              display: "flex", flexDirection: "column", gap: 1.5,
              bgcolor: "#fdfdfd",
              "&::-webkit-scrollbar": { width: 3 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#e8e8e8", borderRadius: 2 },
            }}>
              {messages.length === 0 && (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ color: "#ddd", fontSize: 13 }}>
                    Demarrez la conversation avec {selected.name}
                  </Typography>
                </Box>
              )}
              <AnimatePresence initial={false}>
                {messages.map((m, i) => {
                  const isMe = m.from === currentUser;
                  const showDate = i === 0 ||
                    new Date(m.date).toDateString() !== new Date(messages[i - 1]?.date).toDateString();
                  return (
                    <React.Fragment key={m.id}>
                      {showDate && (
                        <Box sx={{ textAlign: "center", my: 1 }}>
                          <Chip label={fmtDate(m.date)} size="small"
                            sx={{ bgcolor: "#f5f5f5", color: "#bbb", fontSize: 10, border: "1px solid #eee" }} />
                        </Box>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.18 }}
                        style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}
                      >
                        <Stack
                          direction={isMe ? "row-reverse" : "row"}
                          alignItems="flex-end"
                          spacing={1}
                          sx={{ maxWidth: "74%" }}
                        >
                          {!isMe && (
                            <Avatar sx={{
                              width: 26, height: 26,
                              bgcolor: colorFor(m.fromName) + "15",
                              fontSize: 11, fontWeight: 800,
                              color: colorFor(m.fromName), flexShrink: 0,
                            }}>
                              {(m.fromName || "?")[0].toUpperCase()}
                            </Avatar>
                          )}
                          <Box>
                            <Box sx={{
                              px: 2, py: 1.2,
                              borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              background: isMe
                                ? "linear-gradient(135deg, #E63946, #c1121f)"
                                : "#f0f0f0",
                              border: isMe ? "none" : "1px solid #e8e8e8",
                              boxShadow: isMe ? "0 4px 12px rgba(230,57,70,0.2)" : "none",
                            }}>
                              <Typography sx={{
                                color: isMe ? "#fff" : "#1a1a1a",
                                fontSize: 13, lineHeight: 1.55, wordBreak: "break-word",
                              }}>
                                {m.text}
                              </Typography>
                            </Box>
                            <Typography sx={{
                              color: "#ccc", fontSize: 10, mt: 0.4,
                              textAlign: isMe ? "right" : "left", px: 0.5,
                            }}>
                              {fmtTime(m.date)}
                            </Typography>
                          </Box>
                        </Stack>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: "1px solid #f0f0f0", bgcolor: "#fff" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{
                  width: 30, height: 30,
                  bgcolor: myColor + "15",
                  border: "2px solid " + myColor + "30",
                  fontSize: 11, fontWeight: 800, color: myColor, flexShrink: 0,
                }}>
                  {(currentUserName || "?")[0].toUpperCase()}
                </Avatar>
                <TextField
                  fullWidth size="small"
                  placeholder={"Ecrire a " + selected.name + "..."}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#1a1a1a", borderRadius: "14px", fontSize: 13,
                      bgcolor: "#f8f9fa",
                      "& fieldset": { borderColor: "#e8e8e8" },
                      "&:hover fieldset": { borderColor: "#E63946" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#E63946",
                        boxShadow: "0 0 0 3px rgba(230,57,70,0.06)",
                      },
                    },
                    "& input::placeholder": { color: "#ccc", fontSize: 12 },
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!text.trim()}
                  sx={{
                    width: 40, height: 40, borderRadius: "12px",
                    background: text.trim()
                      ? "linear-gradient(135deg, #E63946, #c1121f)"
                      : "#f5f5f5",
                    boxShadow: text.trim() ? "0 4px 12px rgba(230,57,70,0.25)" : "none",
                    transition: "all 0.2s",
                    "&:hover": { transform: text.trim() ? "scale(1.06)" : "none" },
                    "&.Mui-disabled": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <SendIcon sx={{ fontSize: 17, color: text.trim() ? "#fff" : "#ccc" }} />
                </IconButton>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
