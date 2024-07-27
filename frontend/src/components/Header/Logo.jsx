const Logo = () => {
  return (
    <a
      href="/"
      className="flex items-center no-underline"
      target="_blank"
    >
      <i className="fa-solid fa-diagram-project dark:text-white"></i>
      <span> </span>
      <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
        Jira TrieAurora
      </span>
    </a>
  );
};
  
export default Logo;