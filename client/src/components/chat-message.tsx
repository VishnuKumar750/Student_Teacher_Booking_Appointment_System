import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import api from "@/axios/axios-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AxiosError } from "axios";
import type { ApiError } from "@/Types/api-error";
import { toast } from "sonner";

/* ───────── types ───────── */
type ChatMessageItem = {
  _id: string;
  message: string;
  senderRole: string;
  createdAt: string;
};

/* ───────── api ───────── */
const fetchAppointmentMessages = async (
  appointmentId: string,
): Promise<ChatMessageItem[]> => {
  const { data } = await api.get(`/appointment/${appointmentId}/messages`);
  return data?.data;
};

const sendAppointmentMessage = async ({
  appointmentId,
  message,
}: {
  appointmentId: string;
  message: string;
}) => {
  const { data } = await api.post(`/appointment/${appointmentId}/message`, {
    message,
  });
  return data.data;
};

/* ───────── component ───────── */
export default function AppointmentChat({
  appointmentId,
  currentRole,
}: {
  appointmentId: string;
  currentRole: "student" | "teacher";
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  /* fetch messages */
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["appointment-messages", appointmentId],
    queryFn: () => fetchAppointmentMessages(appointmentId),
    enabled: Boolean(appointmentId),
  });

  /* send message */
  const sendMutation = useMutation({
    mutationFn: sendAppointmentMessage,

    onMutate: async ({ appointmentId, message }) => {
      await queryClient.cancelQueries({
        queryKey: ["appointment-messages", appointmentId],
      });

      const previousMessages = queryClient.getQueryData<ChatMessageItem[]>([
        "appointment-messages",
        appointmentId,
      ]);

      const optimisticMessage: ChatMessageItem = {
        _id: `temp-${Date.now()}`,
        message,
        senderRole: currentRole,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ChatMessageItem[]>(
        ["appointment-messages", appointmentId],
        (old = []) => [...old, optimisticMessage],
      );

      return { previousMessages };
    },

    onError: (err: AxiosError<ApiError>, _variables, context) => {
      queryClient.setQueryData(
        ["appointment-messages", appointmentId],
        context?.previousMessages,
      );

      toast.error(err?.response?.data?.error || "chat send failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointment-messages", appointmentId],
      });
    },
  });
  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    sendMutation.mutate({
      appointmentId,
      message: text.trim(),
    });

    setText("");
  };

  return (
    <div className="flex h-56 flex-col border rounded-lg bg-background">
      {/* Header */}
      <div className="border-b px-4 py-2 text-sm font-medium">Chat</div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading messages…</p>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No messages yet
          </p>
        )}

        {messages.map((msg) => {
          const isOwn = msg.senderRole === currentRole;

          return (
            <div
              key={msg._id}
              className={cn(
                "flex w-full",
                isOwn ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "relative max-w-[70%] rounded-xl px-3 py-2 text-sm shadow",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none",
                )}
              >
                {/* Sender label */}
                <span className="mb-1 block text-[10px] font-medium opacity-70">
                  {isOwn ? "You" : msg.senderRole}
                </span>

                {/* Message */}
                <p className="leading-relaxed">{msg.message}</p>

                {/* Time */}
                <span className="mt-1 block text-right text-[10px] opacity-60">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <Input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={sendMutation.isPending}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={sendMutation.isPending || !text.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
