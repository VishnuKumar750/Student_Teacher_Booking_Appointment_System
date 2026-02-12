type PageLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const PageLayout = ({ header, children }: PageLayoutProps) => {
  return (
    <div className="container mx-auto p-6">
      <header>{header}</header>
      {children}
    </div>
  );
};
