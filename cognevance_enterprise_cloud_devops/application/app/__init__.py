"""
Application Factory for Enterprise DevOps Monitoring Microservice.
Organization: Cognevance Technologies
Level: Level 3 Advanced Cloud & DevOps
"""

import logging
import os
from flask import Flask
from .config import get_config
from .metrics import init_metrics


def create_app(config_name=None):
    """
    Application factory pattern for modular configuration and testing.
    """
    app = Flask(__name__, template_folder='templates', static_folder='static')

    # Load configuration
    cfg = get_config(config_name)
    app.config.from_object(cfg)

    # Configure structured logging
    logging.basicConfig(
        level=getattr(logging, app.config.get('LOG_LEVEL', 'INFO')),
        format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}'
    )
    logger = logging.getLogger("enterprise_devops")
    logger.info("Initializing Enterprise DevOps Monitoring Microservice in %s mode", app.config.get('ENV_NAME'))

    # Initialize Prometheus instrumentation
    init_metrics(app)

    # Register blueprints / routes
    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app
