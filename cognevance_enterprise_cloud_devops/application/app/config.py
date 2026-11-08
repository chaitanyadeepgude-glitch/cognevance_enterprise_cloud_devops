"""
Enterprise Configuration Management
Supports 12-factor application design via environment variables.
"""

import os


class BaseConfig:
    PROJECT_NAME = "Enterprise Cloud Infrastructure & DevOps Automation"
    ORGANIZATION = "Cognevance Technologies"
    PROJECT_LEVEL = "Level 3 - Advanced"
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
    SECRET_KEY = os.getenv("SECRET_KEY", "devops-default-insecure-key-replace-in-k8s-secret")
    PORT = int(os.getenv("PORT", "5000"))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    KUBERNETES_NAMESPACE = os.getenv("KUBERNETES_NAMESPACE", "devops-enterprise")
    CLUSTER_NAME = os.getenv("CLUSTER_NAME", "devops-enterprise-cluster")
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")


class DevelopmentConfig(BaseConfig):
    ENV_NAME = "development"
    DEBUG = True
    LOG_LEVEL = "DEBUG"


class TestingConfig(BaseConfig):
    ENV_NAME = "testing"
    TESTING = True
    DEBUG = False
    LOG_LEVEL = "WARNING"


class ProductionConfig(BaseConfig):
    ENV_NAME = "production"
    DEBUG = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


def get_config(name=None):
    env = name or os.getenv("FLASK_ENV", "production").lower()
    if env == "development":
        return DevelopmentConfig()
    elif env == "testing":
        return TestingConfig()
    return ProductionConfig()
