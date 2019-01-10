/**
 * BLOCK: testimonials-list-2
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
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
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

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
    attributes: {
        ...blockProps,
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

        testimonialSize: {
            type: 'number',
            default: 22,
        },

        authorSize: {
            type: 'number',
            default: 14,
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

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

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
                                            style={ {
                                                color: attributes.textColor,
                                                fontSize: `${ attributes.testimonialSize }px`,
                                                lineHeight: `${ attributes.testimonialSize * 1.4 }px`,
                                            } }
                                        />
                                        <RichText.Content
                                            tagName="span"
                                            value={ item.author }
                                            style={ {
                                                color: attributes.textColor,
                                                fontSize: `${ attributes.authorSize }px`,
                                                lineHeight: `${ attributes.authorSize * 1.4 }px`,
                                            } }
                                        />
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
