const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Q3iwwRwJDdlWggbGwgBWsMk8ErJWWe3v9JVhRdYgMx7bZ5qM3sIxs8O44L480YoucGJD4dM10uGdwb2M2K8sSsR00i7gVkrno');
const app = express();
const port = 3030;

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // Ajusta este valor al origen de tu aplicación Angular
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.static('public')); // Asegúrate de tener favicon.ico en la carpeta 'public'

app.use(bodyParser.json());

// Endpoint para recuperar o crear un PaymentIntent
app.get('/get-payment-intent/:amount', async (req, res) => {
    const { amount } = req.params;

    try {
        // Buscar PaymentIntents existentes para este monto
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 1,
            amount: parseInt(amount),
        });

        if (paymentIntents.data.length > 0) {
            // Si existe un PaymentIntent, lo devolvemos
            const existingIntent = paymentIntents.data[0];
            res.json({
                clientSecret: existingIntent.client_secret,
                paymentIntentId: existingIntent.id
            });
        } else {
            // Si no existe, creamos uno nuevo
            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(amount),
                currency: 'ars',
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            });
        }
    } catch (error) {
        console.error('Error al recuperar o crear PaymentIntent:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud de pago' });
    }
});

// Ruta para crear PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // Recibe el monto del frontend

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Convierte el monto a centavos si es necesario
            currency: 'ars', // Cambia la moneda según lo que necesites
            automatic_payment_methods: {
                enabled: true, // Stripe maneja automáticamente los métodos de pago
            },
        });

        console.log('PaymentIntent creado:', paymentIntent.id);
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id  // Añadimos el ID del PaymentIntent a la respuesta
        });
    } catch (error) {
        console.error('Error al crear el PaymentIntent:', error);
        res.status(500).json({ error: 'Error al crear la intención de pago' });
    }
});

// Ruta para confirmar el estado del pago
app.get('/confirm-payment/:paymentIntentId', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
        res.json({ status: paymentIntent.status });
    } catch (error) {
        console.error('Error al confirmar el pago:', error);
        res.status(500).json({ error: 'Error al confirmar el estado del pago' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});