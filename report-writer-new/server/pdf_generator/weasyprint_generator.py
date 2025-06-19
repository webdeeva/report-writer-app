#!/usr/bin/env python3
"""
WeasyPrint PDF Generator

This script converts HTML to PDF using WeasyPrint.
It takes HTML content or a file path as input and outputs a PDF file.

Usage:
    python weasyprint_generator.py --html <html_content> --output <output_path>
    python weasyprint_generator.py --file <html_file_path> --output <output_path>
    
Options:
    --html      HTML content as a string
    --file      Path to HTML file
    --output    Path to output PDF file
    --base-url  Base URL for resolving relative URLs in the HTML
    --debug     Enable debug mode
"""

import argparse
import os
import sys
import logging
from weasyprint import HTML, CSS
from weasyprint.logger import LOGGER

def setup_logging(debug=False):
    """Set up logging configuration."""
    if debug:
        LOGGER.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))
        LOGGER.addHandler(handler)
    else:
        LOGGER.setLevel(logging.ERROR)

def generate_pdf(html_content=None, html_file=None, output_path=None, base_url=None, debug=False):
    """
    Generate a PDF from HTML content or file.
    
    Args:
        html_content (str): HTML content as a string
        html_file (str): Path to HTML file
        output_path (str): Path to output PDF file
        base_url (str): Base URL for resolving relative URLs in the HTML
        debug (bool): Enable debug mode
        
    Returns:
        str: Path to the generated PDF file
    """
    setup_logging(debug)
    
    if not output_path:
        raise ValueError("Output path is required")
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    try:
        if html_content:
            html = HTML(string=html_content, base_url=base_url)
        elif html_file:
            html = HTML(filename=html_file, base_url=base_url)
        else:
            raise ValueError("Either HTML content or file path is required")
        
        # Apply custom styles for better PDF rendering
        css = CSS(string='''
            @page {
                size: letter;  /* 8.5 x 11 inches */
                margin: 1cm;
                @top-center {
                    content: "Report Writer";
                    font-size: 9pt;
                    color: #666;
                }
                @bottom-center {
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #666;
                }
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
            }
            h1, h2, h3, h4, h5, h6 {
                margin-top: 1em;
                margin-bottom: 0.5em;
                page-break-after: avoid;
            }
            p {
                margin-bottom: 0.5em;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            img {
                max-width: 100%;
            }
            .page-break {
                page-break-after: always;
            }
        ''')
        
        # Generate PDF
        html.write_pdf(output_path, stylesheets=[css])
        
        if debug:
            print(f"PDF generated successfully: {output_path}")
        
        return output_path
    
    except Exception as e:
        if debug:
            print(f"Error generating PDF: {str(e)}", file=sys.stderr)
        raise

def main():
    """Main function to parse arguments and generate PDF."""
    parser = argparse.ArgumentParser(description='Convert HTML to PDF using WeasyPrint')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--html', help='HTML content as a string')
    group.add_argument('--file', help='Path to HTML file')
    parser.add_argument('--output', required=True, help='Path to output PDF file')
    parser.add_argument('--base-url', help='Base URL for resolving relative URLs in the HTML')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    
    args = parser.parse_args()
    
    try:
        generate_pdf(
            html_content=args.html,
            html_file=args.file,
            output_path=args.output,
            base_url=args.base_url,
            debug=args.debug
        )
        sys.exit(0)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
