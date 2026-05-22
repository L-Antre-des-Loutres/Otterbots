# OtterHealthCheck - Endpoint de santé HTTP

OtterHealthCheck est une utilité légère qui expose un endpoint HTTP `/healthcheck`. Cela permet à des outils de monitoring externes (comme Uptime Kuma, Better Stack, etc.) de vérifier que le bot est en ligne et fonctionnel.

## Configuration

Vous pouvez configurer le port sur lequel le serveur écoute via le fichier `.env` :

```env
HEALTHCHECK_PORT=3000
```

Si aucune variable n'est définie, le port par défaut est **3000**.

## Fonctionnement

Le serveur est démarré automatiquement dans `src/app/index.ts` via la méthode :

```typescript
OtterHealthCheck.start(bot.getClient());
```

### Endpoint `/healthcheck`

Une requête `GET` sur `http://votre-domaine:PORT/healthcheck` renverra un statut **200 OK** avec le corps suivant :

```json
{
    "status": "ok",
    "uptime": 123.45,
    "ping": 42,
    "version": "1.0.0",
    "timestamp": "2026-05-22T03:30:00.000Z"
}
```

- `status`: Indique que le serveur HTTP répond.
- `uptime`: Temps écoulé (en secondes) depuis le démarrage du processus Node.js.
- `ping`: Latence actuelle de la connexion WebSocket avec Discord (en ms).
- `version`: Version du bot définie dans le `.env`.
- `timestamp`: Heure actuelle au format ISO.

## Utilisation avancée

Si vous avez besoin d'arrêter le serveur manuellement :

```typescript
OtterHealthCheck.stop();
```
