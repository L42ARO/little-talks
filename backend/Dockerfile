# First part is just the builder
FROM golang:1.18.3-alpine AS builder
RUN mkdir /build
ADD go.mod go.sum main.go /build/
ADD pkg /build/pkg
WORKDIR /build
RUN go build

# Multistage docker:
FROM alpine
RUN adduser -S -D -H -h /app appuser
USER appuser
COPY --from=builder /build/little-talks /app/
WORKDIR /app
CMD ["./little-talks"]