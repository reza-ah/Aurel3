import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export async function sendOrderConfirmationToCustomer(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDetails: string;
}) {
    return emailjs.send(
        SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER!,
        {
            to_name: orderData.customerName,
            to_email: orderData.customerEmail,
            order_number: orderData.orderNumber,
            order_details: orderData.orderDetails,
        },
        PUBLIC_KEY
    );
}

export async function sendOrderNotificationToAdmin(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;      // ← اضافه شد
    orderNumber: string;
    orderDetails: string;
}) {
    return emailjs.send(
        SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!,
        {
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,   // ← اضافه شد
            order_number: orderData.orderNumber,
            order_details: orderData.orderDetails,
            order_date: new Date().toLocaleDateString('fa-IR'),
        },
        PUBLIC_KEY
    );
}