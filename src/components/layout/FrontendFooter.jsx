const FrontendFooter = () => {
  return (
    <footer className="bg-light py-4 mt-5 border-top">
      <div className="container text-center text-muted">
        <small>
          &copy; {new Date().getFullYear()} 愛哆啦也愛手作. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default FrontendFooter;
