FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml README.md /app/
COPY app /app/app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir . && \
    curl -Ls https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
EXPOSE 8000
CMD ["uv", "run", "--with", "uvicorn[standard]", "python", "-m", "app.main"]