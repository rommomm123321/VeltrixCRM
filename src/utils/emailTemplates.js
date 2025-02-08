export const verificationEmailTemplate = code => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #12202e; color: #ebf6fa;">
    <div style="max-width: 500px; margin: 0 auto; background: #102736; padding: 20px; border-radius: 8px; 
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border: 1px solid #285673;">
      
      <h2 style="color: #3a7da6; text-align: center;">Код підтвердження</h2>
      <p style="font-size: 16px; text-align: center;">Ваш код підтвердження:</p>
      
      <div style="font-size: 24px; font-weight: bold; text-align: center; background: #3a7da6; 
                  color: #ebf6fa; padding: 10px; border-radius: 5px;">
        ${code}
      </div>
      
      <p style="text-align: center; margin-top: 20px;">Будь ласка, введіть цей код у відповідному полі.</p>
      <p style="text-align: center; color: #4ca3d9; font-size: 12px;">Якщо ви не запитували цей код, просто проігноруйте цей лист.</p>
      
      <hr style="border: none; border-top: 1px solid #285673; margin: 20px 0;">
      
      <footer style="text-align: center; font-size: 12px; color: #ebf6fa;">
        <p>© ${new Date().getFullYear()} VELTRIX. Усі права захищено.</p>
        <p>Powered by <strong style="color: #4ca3d9;">VELTRIX</strong></p>
      </footer>
      
    </div>
  </div>
`
