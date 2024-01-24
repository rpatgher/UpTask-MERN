export const formatDate = date => {
    return new Date(date.split('T')[0].split('-')).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}