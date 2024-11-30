type BodyType = {
  [key: string]: any;
};

type Errors = {
  message: string;
  field: string;
};

export default function validateFields(fields: string[], body: BodyType) {
  const errors: Errors[] = [];

  fields.forEach((key) => {
    if (body[key] == undefined) {
      errors.push({ message: "Campo não existe no body", field: key });
    }
  });

  return errors;
}
