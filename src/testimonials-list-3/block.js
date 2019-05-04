import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;
import { blockProps, ContainerSave } from '../commonComponents/container/container';
import { getTypography } from '../commonComponents/typography/typography';
import Edit from './edit';

/**
 * Provides the initial data for new block
 * @type {{title: string, icon: string, iconMediaId: string, iconMediaUrl: string, description: string}}
 */
export const defaultItem = {
    testimonial: __( 'New testimonial', 'kenzap-testimonials' ),
    imageId: '',
    imageUrl: '',
    author: __( 'John Doe', 'kenzap-testimonials' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        testimonial: __( 'Nulla ante eros, venenatis vel male suada sit amet.', 'kenzap-testimonials' ),
        author: __( 'Nicolas Brown, Instructor', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-1.png',
        key: new Date().getTime() + 1,
    }, {
        testimonial: __( 'Consectetur adipisci ngel it lorem ipsum dolor sit.', 'kenzap-testimonials' ),
        author: __( 'Ema Ducon, Student', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-2.png',
        key: new Date().getTime() + 2,
    }, {
        testimonial: __( 'Lorem ip sum dolor sit ameti co nse ctetur adipi scing.', 'kenzap-testimonials' ),
        author: __( 'Maria Jonson, Student', 'kenzap-testimonials' ),
        imageId: '',
        imageUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonial-img-3.png',
        key: new Date().getTime() + 3,
    },
] );

export const attrs =  {
        ...blockProps,

        align: {
            type: 'string',
            default: 'full',
        },

        // override from container
        containerPadding: {
            type: 'number',
            default: 58,
        },

        // override from container
        backgroundImage: {
            type: 'string',
            default: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-3/testimonials-bg.jpg',
        },

        imageSize: {
            type: 'number',
            default: 126,
        },

        items: {
            type: 'array',
            default: [],
        },

        typography: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    };

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddings2': `${ attributes.containerSidePadding }px`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
    };

    return {
        kenzapContanerStyles,
        vars,
    };
};

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Testimonial', 'kenzap-timeline' ),
        'font-size': 30,
        'font-weight': 6,
        'line-height': 36,
        'margin-bottom': 0,
    },
    {
        'title': __( '- Author', 'kenzap-timeline' ),
        'font-size': 16,
        'font-weight': 4,
        'line-height': 22,
        'margin-top': 20,
        'margin-bottom': 20,
    },
]);

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/testimonials-list-3', {
    title: __( 'Kenzap Testimonials List 3', 'kenzap-testimonials' ),
    icon: 'yes',
    category: 'layout',
    keywords: [
        __( 'Testimonials', 'kenzap-testimonials' ),
    ],
    anchor: true,
    html: true,
    supports: {
        align: [ 'full', 'wide' ],
    },
    attributes: attrs,

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );

            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        Object.keys( props.attributes ).forEach( attr => {
            if ( typeof props.attributes[ attr ] === 'undefined' ) {
                props.attributes[ attr ] = attrs[ attr ].default;
            }
        } );

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        Object.keys( attributes ).forEach( attr => {
            if ( typeof attributes[ attr ] === 'undefined' ) {
                attributes[ attr ] = attrs[ attr ].default;
            }
        } );

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-testimonials-3 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        { attributes.nestedBlocks == 'top' && <InnerBlocks.Content /> }
                        <div className="owl-carousel">
                            { attributes.items && attributes.items.map( item => (
                                <div
                                    key={ item.key }
                                    className="testimonial-box"
                                >
                                    <div className="testimonial-image" style={ { width: `${ attributes.imageSize }px` } }>
                                        <img src={ item.imageUrl } alt={ item.author.replace( /<(?:.|\n)*?>/gm, '' ) } />
                                    </div>
                                    <div className="testimonial-content">
                                        <RichText.Content
                                            tagName="p"
                                            value={ item.testimonial }
                                            style={ getTypography( attributes, 0 ) }
                                        />
                                        <RichText.Content
                                            tagName="span"
                                            value={ item.author }
                                            style={ getTypography( attributes, 1 ) }
                                        />
                                    </div>
                                </div>
                            ) ) }
                        </div>
                        { attributes.nestedBlocks == 'bottom' && <InnerBlocks.Content /> }
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
