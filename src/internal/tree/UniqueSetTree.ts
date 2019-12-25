//================================================================ 
/** @module std.base */
//================================================================
import { SetTree } from "./SetTree";
import { XTreeNode } from "./XTreeNode";

import { UniqueSet } from "../../base/container/UniqueSet";
import { SetElementList } from "../container/associative/SetElementList";

/**
 * @hidden
 */
export class UniqueSetTree<Key, 
        Source extends UniqueSet<Key, 
            Source,
            SetElementList.Iterator<Key, true, Source>,
            SetElementList.ReverseIterator<Key, true, Source>>>
    extends SetTree<Key, true, Source>
{
    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    public constructor(source: Source, comp: (x: Key, y: Key) => boolean)
    {
        super(source, comp, 
            function (x: SetElementList.Iterator<Key, true, Source>, y: SetElementList.Iterator<Key, true, Source>): boolean
            {
                return comp(x.value, y.value);
            }
        );
    }

    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    public nearest_by_key(val: Key): XTreeNode<SetElementList.Iterator<Key, true, Source>> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: XTreeNode<SetElementList.Iterator<Key, true, Source>> | null = this.root_;

        while (true) // UNTIL MEET THE MATCHED VALUE OR FINAL BRANCH
        {
            let it: SetElementList.Iterator<Key, true, Source> = ret.value;
            let my_node: XTreeNode<SetElementList.Iterator<Key, true, Source>> | null = null;

            // COMPARE
            if (this.key_comp()(val, it.value))
                my_node = ret.left;
            else if (this.key_comp()(it.value, val))
                my_node = ret.right;
            else
                return ret; // MATCHED VALUE

            // FINAL BRANCH? OR KEEP GOING
            if (my_node === null)
                break;
            else
                ret = my_node;
        }
        return ret; // DIFFERENT NODE
    }

    public upper_bound(val: Key): SetElementList.Iterator<Key, true, Source>
    {
        //--------
        // FIND MATCHED NODE
        //--------
        let node: XTreeNode<SetElementList.Iterator<Key, true, Source>> | null = this.nearest_by_key(val);
        if (node === null)
            return this.source().end();

        //--------
        // RETURN BRANCH
        //--------
        let it: SetElementList.Iterator<Key, true, Source> = node.value;

        // MUST BE it.value > key
        if (this.key_comp()(val, it.value))
            return it; 
        else
            return it.next();
    }
}