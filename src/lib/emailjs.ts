import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const TEMPLATE_CUSTOMER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CUSTOMER;
const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN;

// ✅ بررسی وجود env vars
if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_CUSTOMER || !TEMPLATE_ADMIN) {
    console.warn('⚠️ EmailJS env vars not configured:', {
        SERVICE_ID: !!SERVICE_ID,
        PUBLIC_KEY: !!PUBLIC_KEY,
        TEMPLATE_CUSTOMER: !!TEMPLATE_CUSTOMER,
        TEMPLATE_ADMIN: !!TEMPLATE_ADMIN,
    });
}

export async function sendOrderConfirmationToCustomer(orderData: {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDetails: string;
}) {
    if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_CUSTOMER) {
        console.error('❌ EmailJS not configured - cannot send to customer');
        return;
    }

    console.log('📧 Sending confirmation to customer:', orderData.customerEmail);

    try {
        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_CUSTOMER,
            {
                to_name: orderData.customerName,
                to_email: orderData.customerEmail,
                order_number: orderData.orderNumber,
                order_details: orderData.orderDetails,
            },
            PUBLIC_KEY
        );
        console.log('✅ Customer email sent:', result.status);
        return result;
    } catch (error) {
        console.error('❌ Failed to send customer email:', error);
        throw error;
    }
}

export async function sendOrderNotificationToAdmin(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderNumber: string;
    orderDetails: string;
}) {
    if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ADMIN) {
        console.error('❌ EmailJS not configured - cannot send to admin');
        return;
    }

    console.log('📧 Sending notification to admin for order:', orderData.orderNumber);

    try {
        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ADMIN,
            {
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                order_number: orderData.orderNumber,
                order_details: orderData.orderDetails,
                order_date: new Date().toLocaleDateString('fa-IR'),
            },
            PUBLIC_KEY
        );
        console.log('✅ Admin email sent:', result.status);
        return result;
    } catch (error) {
        console.error('❌ Failed to send admin email:', error);
        throw error;
    }
}