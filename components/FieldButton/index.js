import { Button } from "@dataesr/react-dsfr";

export default function FieldButton({ title, onClick, dataTestid, icon }) {
  return (
    <Button
      icon={icon}
      data-testid={dataTestid}
      size="sm"
      secondary
      onClick={onClick}
    >
      {title}
    </Button>
  );
}
