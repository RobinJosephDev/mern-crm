interface Props {
  total: number;
  page: number;
  pageSize: number;
  onChange: (p: number) => void;
}

const Pagination = ({ total, page, pageSize, onChange }: Props) => {
  const pages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-end mt-4 gap-2">
      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={`px-3 py-1 border rounded ${
            page === i + 1 ? "bg-blue-600 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
