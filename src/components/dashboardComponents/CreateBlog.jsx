export default function CreateBlogPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState("");
  const [mdxContent, setMdxContent] = useState("");
  const [saving, setSaving] = useState(false); // <-- new state

  const components = { Button };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/blogsCategory");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSave = async () => {
    const finalCategory = selectedCategory || newCategory.trim();
    const parsedTags = tags.split(",").map((tag) => tag.trim()).filter(Boolean);

    if (!title || !slug || !finalCategory || !mdxContent) {
      alert("Please fill in all required fields");
      return;
    }

    if (parsedTags.length > 3) {
      alert("You can only add up to 3 tags.");
      return;
    }

    try {
      setSaving(true); // start saving
      const res = await axios.post("/api/create", {
        title,
        slug,
        thumbnail,
        category: finalCategory,
        tags: parsedTags,
        content: mdxContent,
      });

      alert(res.data.message);
      setTitle("");
      setSlug("");
      setThumbnail("");
      setTags("");
      setMdxContent("");
      setSelectedCategory("");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create blog");
    } finally {
      setSaving(false); // end saving
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

      {/* ...your inputs... */}

      <Editor content={mdxContent} setContent={setMdxContent} />

      <Button
        className="mt-4"
        onClick={handleSave}
        disabled={saving} // disable button while saving
      >
        {saving ? "Saving..." : "Save Blog"}
      </Button>

      <div className="border p-4 mt-6 rounded bg-gray-100 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <MDXRenderer source={mdxContent} components={components} />
      </div>
    </div>
  );
}
