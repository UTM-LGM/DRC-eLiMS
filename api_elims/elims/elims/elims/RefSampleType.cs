using System;
using System.Collections.Generic;

namespace elims.elims;

public partial class RefSampleType
{
    public int Id { get; set; }

    public int? RubberTypeId { get; set; }

    public string? SampleType { get; set; }

    public string? SampleCode { get; set; }

    public string? SampleCategory { get; set; }
}
