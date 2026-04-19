import React, { useState } from 'react';
import Viewer from 'react-viewer';
import { Send, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';

interface Message {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'pdf' | 'none';
    senderRole: 'patient' | 'doctor';
    timestamp: string;
}

export default function ConsultationChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
        content: "Hello Doctor, I have some rashes on my arm.", 
        senderRole: 'patient', 
        timestamp: '10:00 AM', 
        mediaType: 'none' 
    },
    { 
        content: "Please send a clear image of the affected area.", 
        senderRole: 'doctor', 
        timestamp: '10:02 AM', 
        mediaType: 'none' 
    }
  ]);
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerImage, setViewerImage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !mediaFile) return;

    const newMessage: Message = {
        content: text,
        senderRole: 'patient',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mediaType: mediaFile?.type.includes('image') ? 'image' : mediaFile?.type.includes('pdf') ? 'pdf' : 'none',
        mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined
    };

    setMessages([...messages, newMessage]);
    setText('');
    setMediaFile(null);
  };

  return (
    <div className="glass rounded-2xl h-[500px] flex flex-col overflow-hidden border border-white/10">
      <div className="messages-area flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.senderRole === 'patient' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.senderRole === 'patient' 
                ? 'bg-primary/20 border border-primary/30 rounded-tr-none' 
                : 'bg-white/5 border border-white/10 rounded-tl-none'
            }`}>
              <p className="text-sm">{msg.content}</p>
              
              {msg.mediaType === 'image' && (
                <div className="mt-3 relative group">
                  <img 
                    src={msg.mediaUrl} 
                    alt="Attachment" 
                    className="w-full rounded-xl cursor-pointer hover:opacity-80 transition-all border border-white/10"
                    onClick={() => {
                      setViewerImage(msg.mediaUrl || '');
                      setIsViewerVisible(true);
                    }} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                    <ImageIcon className="text-white drop-shadow-lg" />
                  </div>
                </div>
              )}

              {msg.mediaType === 'pdf' && (
                 <a href={msg.mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold text-xs mt-3 bg-primary/10 p-3 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all">
                   <FileText size={16} /> View PDF Document
                 </a>
              )}
            </div>
            <span className="text-[10px] text-text-secondary mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3">
        <label className="cursor-pointer text-text-secondary hover:text-primary transition-all">
          <Paperclip size={22} />
          <input 
            type="file" 
            onChange={e => setMediaFile(e.target.files?.[0] || null)} 
            accept="image/*,application/pdf" 
            className="hidden" 
          />
        </label>
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type your message..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
        />
        <button type="submit" className="btn btn-primary h-12 w-12 flex items-center justify-center p-0 rounded-xl">
          <Send size={20} />
        </button>
      </form>

      <Viewer
        visible={isViewerVisible}
        onClose={() => setIsViewerVisible(false)}
        images={[{src: viewerImage, alt: 'Chat attachment'}]}
      />
    </div>
  );
}
