function Heading({ level, text, color, font }) {
  const Tag = `h${level}`;

  const generalStyles = ` ${
    font ? font : "font-montserrat"
  } tracking-wide ${color && `text-${color}`}`;

  const headingStyles = {
    1: "text-3xl font-semibold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-semibold",
    5: "text-base font-semibold",
    6: "text-sm font-semibold",
  };
  const componentStyle = headingStyles[level];
  return (
    <Tag className={`${generalStyles + " " + componentStyle}`}>{text}</Tag>
  );
}

export default Heading;
