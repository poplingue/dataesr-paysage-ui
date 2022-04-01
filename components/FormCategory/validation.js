export default function validation(data) {
    // TODO -> connecter à openapi
    const errors = [];
    if (!data.usualNameFr || data.usualNameFr === '')
        errors.push('Vous devez renseigner le nom usuel en français');

    return errors;
}
