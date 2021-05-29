export const priceFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',      
});

export const numberFormatter = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
