import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export const CreateMarketButton = ({
  createMarket,
}: {
  createMarket: (question: string, expiresAt: number) => Promise<void>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <button
        onClick={openModal}
        className="block text-white bg-[#1F2937] hover:bg-[#1f2937ad] font-medium rounded-lg text-sm px-5 py-3 text-center"
        type="button"
      >
        Create Market
      </button>

      {isModalOpen && (
        <CreateMarketModal
          onClose={() => setIsModalOpen(false)}
          createMarket={createMarket}
        />
      )}
    </>
  );
};

interface CreateMarketModalProps {
  onClose: () => void;
  createMarket: (question: string, expiresAt: number) => void;
}

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({
  onClose,
  createMarket,
}) => {
  const [question, setQuestion] = useState("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await createMarket(
        question,
        Math.floor(new Date(expirationDate).getTime() / 1000)
      );
      onClose();
    } catch (error) {
      console.error("Failed to create market:", error);
      alert(error instanceof Error ? error.message : "Failed to create market");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      id="crud-modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-[#1a2027] rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Market
            </h3>
            <CloseModalButton onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Question
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="block w-full mt-2 p-3 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type market name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <DatePicker
                value={expirationDate}
                onChange={(date) => setExpirationDate(date)}
              />
              <CategoryDropdown
                value={category}
                onChange={(selectedCategory) => setCategory(selectedCategory)}
              />
            </div>

            <FilePicker file={file} onChange={handleFileChange} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F2937] text-white font-medium rounded-lg py-3 text-sm hover:bg-[#1f2937ad] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating market...
                </>
              ) : (
                <>
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add new market
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface CloseModalButtonProps {
  onClick: () => void;
}

const CloseModalButton: React.FC<CloseModalButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
      <span className="sr-only">Close modal</span>
    </button>
  );
};

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <label
        htmlFor="datetimepicker"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        Expires At
      </label>
      <input
        id="datetimepicker"
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full mt-2 p-3 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        required
      />
    </div>
  );
};

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
}) => {
  const categories = [
    "Select category",
    "News",
    "Sports",
    "Politics",
    "Entertainment",
    "Crypto",
    "Technology",
  ];

  return (
    <div>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        Category
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full mt-2 p-3 bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        required
      >
        {categories.map((item) => {
          return (
            <option key={item} value={item === "Select category" ? "" : item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

interface FilePickerProps {
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onChange }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {file ? (
              file.name
            ) : (
              <>
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={onChange}
          accept="image/svg+xml,image/png,image/jpeg,image/gif"
        />
      </label>
    </div>
  );
};
