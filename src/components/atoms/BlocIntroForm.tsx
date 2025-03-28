const BlocIntroForm = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  if (!title && !subtitle) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl md:text-4xl font-bold leading-general text-center text-balance">
        {title}
      </h1>
      {subtitle && (
        <div
          className="text-base md:text-xl leading-general font-medium wysiwyg"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      )}
    </div>
  );
};

export default BlocIntroForm;
