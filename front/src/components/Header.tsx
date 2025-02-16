import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <nav className="max-w-xl mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
        <div className="flex space-x-4">
          <Link href="/setor" className="hover:underline">
            Criar Setores
          </Link>
          <Link href="/tipos-documento" className="hover:underline">
            Criar Tipos de Documento
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;