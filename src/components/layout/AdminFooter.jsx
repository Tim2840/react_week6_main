const AdminFooter = () => {
  return (
    <footer className="bg-white py-3 border-top mt-5">
      <div className="container-fluid text-center">
        <p className="mb-0 text-muted small">
          &copy; {new Date().getFullYear()} 愛哆啦也愛手作後台管理系統
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
