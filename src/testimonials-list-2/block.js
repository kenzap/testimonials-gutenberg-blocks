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
    author: __( 'John Doe', 'kenzap-testimonials' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        testimonial: __( 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras justo odio, dapibus ac facilisis in, egestas eget quam integer. Curabitur blandit tempus.', 'kenzap-testimonials' ),
        author: __( '- Barclay Widerski', 'kenzap-testimonials' ),
        key: new Date().getTime() + 1,
    }, {
        testimonial: __( 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper. Cras justo odio, dapibus ac facilisis in, egestas eget quam aenean lacinia.', 'kenzap-testimonials' ),
        author: __( '- Coriss Ambady', 'kenzap-testimonials' ),
        key: new Date().getTime() + 2,
    }, {
        testimonial: __( 'Sed posuere consectetur est at lobortis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula lacinia odio sem nec elit.', 'kenzap-testimonials' ),
        author: __( '- Conor Gibson', 'kenzap-testimonials' ),

        key: new Date().getTime() + 3,
    },
] );

export const attrs = {
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
            default: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-2/testimonials-bg.jpg',
        },

        textColor: {
            type: 'string',
            default: '#fff',
        },

        icon: {
            type: 'object',
            default: {
                iconMediaId: '',
                iconMediaUrl: window.kenzap_testimonials_gutenberg_path + 'testimonials-list-2/quote-icon.svg',
            },
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
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

/**
 * Define typography defaults
 */
export const typographyArr = JSON.stringify([
    {
        'title': __( '- Testimonial', 'kenzap-testimonials' ),
        'font-size': 22,
        'font-weight': 4,
        'line-height': 30,
        'margin-bottom': 20,
        //'color':'-'
    },
    {
        'title': __( '- Author', 'kenzap-testimonials' ),
        'font-size': 14,
        'font-weight': 5,
        'line-height': 19,
        'margin-bottom': 20,
        //'color':'-'
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
registerBlockType( 'kenzap/testimonials-list-2', {
    title: __( 'Kenzap Testimonials List 2', 'kenzap-testimonials' ),
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
                    className={ `kenzap-testimonials-2 block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
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
                                    <div className="testimonial-content">
                                        <div
                                            style={ { backgroundImage: attributes.icon.iconMediaUrl !== 'none' ? `url(${ attributes.icon.iconMediaUrl })` : 'none' } }
                                            className="testimonial-icon"
                                        />
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
