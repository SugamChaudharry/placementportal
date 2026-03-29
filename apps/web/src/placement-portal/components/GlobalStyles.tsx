export function GlobalStyles() {
  return (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .placement-portal-root *,.placement-portal-root *::before,.placement-portal-root *::after{box-sizing:border-box;}
    .placement-portal-root{font-family:'Plus Jakarta Sans',-apple-system,sans-serif;}
    .placement-portal-root ::-webkit-scrollbar{width:4px;height:4px;}
    .placement-portal-root ::-webkit-scrollbar-track{background:transparent;}
    .placement-portal-root ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px;}
    .placement-portal-root .fi{animation:pp-fi .25s ease both;}
    .placement-portal-root .su{animation:pp-su .3s ease both;}
    @keyframes pp-fi{from{opacity:0}to{opacity:1}}
    @keyframes pp-su{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .placement-portal-root .hl{transition:transform .2s,box-shadow .2s;}
    .placement-portal-root .hl:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(79,70,229,.12);}
    .placement-portal-root .gt{background:linear-gradient(135deg,#4f46e5,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .placement-portal-root .sb{background:linear-gradient(160deg,#0f172a 0%,#1a1150 100%);}
    .placement-portal-root .code{font-family:'JetBrains Mono',monospace;}
    .placement-portal-root input,.placement-portal-root textarea,.placement-portal-root select{font-family:'Plus Jakarta Sans',sans-serif;}
  `}</style>
  );
}
