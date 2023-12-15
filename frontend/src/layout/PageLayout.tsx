
type LayoutProps = {
  children: React.ReactNode
}

export const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="px-2 max-w-screen-2xl mx-auto flex flex-col justify-between h-[100vh]">
      <nav>
        NAVBAR
      </nav>
      <main>
        {children}
      </main>
      <footer>
        FOOTER
      </footer>
    </div>
  )
}
