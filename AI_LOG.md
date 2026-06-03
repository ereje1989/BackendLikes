# AI_LOG.md - Documentación de Conversaciones con IA

## 📋 Resumen General
**Fecha:** 02/06/26
**Contexto:** Implementación de API REST para sistema de mensajes con likes usando Express, PostgreSQL y WebSockets
**IA Utilizada:** Asistente de programación

---

## 🗣️ Prompts Realizados

### Prompt 1: Revisión y documentación del código

**Objetivo:** Obtener documentación estructurada sobre el proceso de desarrollo con IA.

---

## 📝 Decisiones de Implementación

### 1. **Estructura de consultas SQL**
- **Decisión:** Usar `LEFT JOIN` con `COUNT` para contar likes
- **Razón:** Incluir mensajes sin likes (0 likes en lugar de omitirlos)
- **Alternativa descartada:** Subquery separada (menos eficiente)

### 2. **Manejo de broadcast WebSocket**
- **Decisión:** Emitir eventos después de enviar respuesta HTTP
- **Razón:** No bloquear la respuesta al cliente si WebSocket falla
- **Razón técnica:** El `res.json()` ya envía la respuesta, broadcast es asíncrono

### 3. **Tipado con TypeScript**
- **Decisión:** Usar `Request` y `Response` de Express con type hints
- **Razón:** Mejor autocompletado y detección temprana de errores

### 4. **Validación de contenido**
- **Decisión:** Verificar `content.trim() === ""` y `content.length < 1`
- **Razón:** Evitar mensajes vacíos o solo espacios
- **Mejora posible:** Unificar en una sola validación

---

## 🗣️ Conversaciones Documentadas con IA

### Conversación 1: Broadcasting WebSocket sin bloquear respuesta HTTP

**Prompt:**
> "¿Cómo manejar broadcasting con WebSocket sin bloquear la respuesta HTTP?"

**Respuesta de la IA:**
> Usar `async/await` sin `await` en el broadcast, o utilizar `Promise.allSettled()` para manejar múltiples operaciones asíncronas sin afectar la respuesta principal.

**Ejemplo práctico:**
```typescript
// Opción 1: Fire and forget (sin await)
export const createMessage = async (req: Request, res: Response) => {
    const result = await pool.query(/* ... */);
    res.status(201).json(result.rows[0]);
    
    // No usar await - no bloquea la respuesta
    broadcast({
        type: "NEW_MESSAGE",
        payload: result.rows[0]
    });
};

// Opción 2: Promise.allSettled() para múltiples broadcasts
export const createMessage = async (req: Request, res: Response) => {
    const result = await pool.query(/* ... */);
    res.status(201).json(result.rows[0]);
    
    const broadcasts = [
        broadcast({ type: "NEW_MESSAGE", payload: result.rows[0] }),
        broadcast({ type: "NOTIFY_ADMIN", payload: { userId: req.user.id } })
    ];
    
    Promise.allSettled(broadcasts).catch(console.error);
};```
```
 [Async patterns in Node.js - Event Loop y Timers](https://node-postgres.com/features/queries#parameterized-queries)

[Promise.allSettled() - MDN Web Docs](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
 ```
```
## 🐛 Problemas Identificados

### Problema 1: Inyección SQL
**Severidad:** 🔴 Alta
```typescript
// ❌ Actual (susceptible)
await pool.query(`
    INSERT INTO likes(message_id)
    VALUES(${id})
`, []);

// ✅ Correcto
await pool.query(`
    INSERT INTO likes(message_id)
    VALUES($1)
`, [id]);



