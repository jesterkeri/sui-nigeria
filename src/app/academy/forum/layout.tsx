const blockingScript = `
(function(){
  try{
    var m=localStorage.getItem('forum-mode')||'light';
    var bg=m==='dark'?'#000':'#f5f5f0';
    var s=document.createElement('style');
    s.setAttribute('data-forum-theme','');
    s.textContent='.forum-page{background:'+bg+' !important}';
    document.head.appendChild(s);
  }catch(e){}
})();
`;

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: blockingScript }} />
      {children}
    </>
  );
}
